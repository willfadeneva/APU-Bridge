import {
  users,
  posts,
  postLikes,
  comments,
  connections,
  messages,
  jobs,
  jobApplications,
  type User,
  type UpsertUser,
  type InsertPost,
  type Post,
  type PostWithAuthor,
  type PostWithDetails,
  type InsertComment,
  type Comment,
  type InsertConnection,
  type Connection,
  type ConnectionWithUsers,
  type InsertMessage,
  type Message,
  type MessageWithUsers,
  type InsertJob,
  type Job,
  type JobWithPoster,
  type InsertJobApplication,
  type JobApplication,
  type PostLike,
  type UpdateUserProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, ne, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: UpdateUserProfile): Promise<User>;
  searchUsers(query: string, currentUserId: string): Promise<User[]>;
  
  // Post operations
  createPost(post: InsertPost, authorId: string): Promise<Post>;
  getFeedPosts(userId: string, limit?: number): Promise<PostWithDetails[]>;
  getPostById(id: string): Promise<PostWithDetails | undefined>;
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;
  isPostLikedByUser(postId: string, userId: string): Promise<boolean>;
  
  // Comment operations
  createComment(comment: InsertComment, authorId: string): Promise<Comment>;
  getPostComments(postId: string): Promise<(Comment & { author: User })[]>;
  
  // Connection operations
  sendConnectionRequest(connection: InsertConnection, requesterId: string): Promise<Connection>;
  acceptConnectionRequest(connectionId: string): Promise<void>;
  rejectConnectionRequest(connectionId: string): Promise<void>;
  getUserConnections(userId: string): Promise<ConnectionWithUsers[]>;
  getPendingConnectionRequests(userId: string): Promise<ConnectionWithUsers[]>;
  getSuggestedConnections(userId: string, limit?: number): Promise<User[]>;
  areUsersConnected(userId1: string, userId2: string): Promise<boolean>;
  
  // Message operations
  sendMessage(message: InsertMessage, senderId: string): Promise<Message>;
  getConversation(userId1: string, userId2: string): Promise<MessageWithUsers[]>;
  getUserConversations(userId: string): Promise<{
    otherUser: User;
    lastMessage: Message;
    unreadCount: number;
  }[]>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // Job operations
  createJob(job: InsertJob, posterId: string): Promise<Job>;
  getJobs(limit?: number): Promise<JobWithPoster[]>;
  getJobById(id: string): Promise<JobWithPoster | undefined>;
  applyToJob(application: InsertJobApplication, applicantId: string): Promise<JobApplication>;
  getUserJobApplications(userId: string): Promise<(JobApplication & { job: JobWithPoster })[]>;
  getJobApplications(jobId: string): Promise<(JobApplication & { applicant: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: UpdateUserProfile): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    const usersList = await db
      .select()
      .from(users)
      .where(
        and(
          ne(users.id, currentUserId),
          or(
            ilike(users.firstName, `%${query}%`),
            ilike(users.lastName, `%${query}%`),
            ilike(users.title, `%${query}%`),
            ilike(users.university, `%${query}%`),
            ilike(users.major, `%${query}%`)
          )
        )
      )
      .limit(20);
    return usersList;
  }

  // Post operations
  async createPost(post: InsertPost, authorId: string): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values({ ...post, authorId })
      .returning();
    return newPost;
  }

  async getFeedPosts(userId: string, limit = 20): Promise<PostWithDetails[]> {
    const feedPosts = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    const postsWithDetails: PostWithDetails[] = [];
    
    for (const { post, author } of feedPosts) {
      if (!author) continue;
      
      // Get likes
      const postLikesList = await db
        .select()
        .from(postLikes)
        .where(eq(postLikes.postId, post.id));

      // Get comments with authors
      const postComments = await db
        .select({
          comment: comments,
          author: users,
        })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.postId, post.id))
        .orderBy(desc(comments.createdAt));

      const commentsWithAuthors = postComments
        .filter(({ author }) => author)
        .map(({ comment, author }) => ({ ...comment, author: author! }));

      postsWithDetails.push({
        ...post,
        author,
        likes: postLikesList,
        comments: commentsWithAuthors,
      });
    }

    return postsWithDetails;
  }

  async getPostById(id: string): Promise<PostWithDetails | undefined> {
    const [postData] = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id));

    if (!postData?.author) return undefined;

    const { post, author } = postData;

    // Get likes
    const postLikesList = await db
      .select()
      .from(postLikes)
      .where(eq(postLikes.postId, post.id));

    // Get comments with authors
    const postComments = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, post.id))
      .orderBy(desc(comments.createdAt));

    const commentsWithAuthors = postComments
      .filter(({ author }) => author)
      .map(({ comment, author }) => ({ ...comment, author: author! }));

    return {
      ...post,
      author,
      likes: postLikesList,
      comments: commentsWithAuthors,
    };
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await db.insert(postLikes).values({ postId, userId });
    await db
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    await db
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return !!like;
  }

  // Comment operations
  async createComment(comment: InsertComment, authorId: string): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values({ ...comment, authorId })
      .returning();
    
    await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, comment.postId));
    
    return newComment;
  }

  async getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
    const postComments = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return postComments
      .filter(({ author }) => author)
      .map(({ comment, author }) => ({ ...comment, author: author! }));
  }

  // Connection operations
  async sendConnectionRequest(connection: InsertConnection, requesterId: string): Promise<Connection> {
    const [newConnection] = await db
      .insert(connections)
      .values({ ...connection, requesterId })
      .returning();
    return newConnection;
  }

  async acceptConnectionRequest(connectionId: string): Promise<void> {
    await db
      .update(connections)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(connections.id, connectionId));
  }

  async rejectConnectionRequest(connectionId: string): Promise<void> {
    await db
      .update(connections)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(eq(connections.id, connectionId));
  }

  async getUserConnections(userId: string): Promise<ConnectionWithUsers[]> {
    const userConnections = await db
      .select({
        connection: connections,
        requester: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          title: users.title,
          university: users.university,
          graduationYear: users.graduationYear,
          major: users.major,
          about: users.about,
          skills: users.skills,
          location: users.location,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(connections)
      .leftJoin(users, eq(connections.requesterId, users.id))
      .where(
        and(
          or(eq(connections.requesterId, userId), eq(connections.addresseeId, userId)),
          eq(connections.status, 'accepted')
        )
      );

    // Get addressee information in a separate query to avoid alias conflicts
    const addresseeData = await db
      .select()
      .from(users)
      .where(sql`${users.id} IN (${sql.join(userConnections.map(c => c.connection.addresseeId), sql`, `)})`);

    const addresseeMap = new Map(addresseeData.map(user => [user.id, user]));

    return userConnections
      .filter(({ requester }) => requester && requester.id)
      .map(({ connection, requester }) => ({
        ...connection,
        requester: requester!,
        addressee: addresseeMap.get(connection.addresseeId)!,
      }))
      .filter(item => item.addressee);
  }

  async getPendingConnectionRequests(userId: string): Promise<ConnectionWithUsers[]> {
    const pendingRequests = await db
      .select({
        connection: connections,
        requester: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          title: users.title,
          university: users.university,
          graduationYear: users.graduationYear,
          major: users.major,
          about: users.about,
          skills: users.skills,
          location: users.location,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(connections)
      .leftJoin(users, eq(connections.requesterId, users.id))
      .where(
        and(
          eq(connections.addresseeId, userId),
          eq(connections.status, 'pending')
        )
      );

    // Get addressee (current user) info
    const addressee = await this.getUser(userId);

    return pendingRequests
      .filter(({ requester }) => requester && requester.id && addressee)
      .map(({ connection, requester }) => ({
        ...connection,
        requester: requester!,
        addressee: addressee!,
      }));
  }

  async getSuggestedConnections(userId: string, limit = 10): Promise<User[]> {
    // Get users that are not connected and not the current user
    const suggestedUsers = await db
      .select()
      .from(users)
      .where(
        and(
          ne(users.id, userId),
          sql`${users.id} NOT IN (
            SELECT ${connections.requesterId} FROM ${connections} 
            WHERE ${connections.addresseeId} = ${userId}
            UNION
            SELECT ${connections.addresseeId} FROM ${connections} 
            WHERE ${connections.requesterId} = ${userId}
          )`
        )
      )
      .limit(limit);

    return suggestedUsers;
  }

  async areUsersConnected(userId1: string, userId2: string): Promise<boolean> {
    const [connection] = await db
      .select()
      .from(connections)
      .where(
        and(
          or(
            and(eq(connections.requesterId, userId1), eq(connections.addresseeId, userId2)),
            and(eq(connections.requesterId, userId2), eq(connections.addresseeId, userId1))
          ),
          eq(connections.status, 'accepted')
        )
      );
    return !!connection;
  }

  // Message operations
  async sendMessage(message: InsertMessage, senderId: string): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({ ...message, senderId })
      .returning();
    return newMessage;
  }

  async getConversation(userId1: string, userId2: string): Promise<MessageWithUsers[]> {
    const conversation = await db
      .select({
        message: messages,
        sender: users,
        receiver: users,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .leftJoin(users, eq(messages.receiverId, users.id))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(desc(messages.createdAt));

    return conversation
      .filter(({ sender, receiver }) => sender && receiver)
      .map(({ message, sender, receiver }) => ({
        ...message,
        sender: sender!,
        receiver: receiver!,
      }));
  }

  async getUserConversations(userId: string): Promise<{
    otherUser: User;
    lastMessage: Message;
    unreadCount: number;
  }[]> {
    // Get all unique conversation partners
    const conversationPartners = await db
      .selectDistinct({
        otherUserId: sql<string>`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`,
      })
      .from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      );

    const conversations = [];

    for (const { otherUserId } of conversationPartners) {
      // Get the other user
      const [otherUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, otherUserId));

      if (!otherUser) continue;

      // Get the last message
      const [lastMessage] = await db
        .select()
        .from(messages)
        .where(
          or(
            and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
            and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      if (!lastMessage) continue;

      // Get unread count
      const [unreadResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.senderId, otherUserId),
            eq(messages.receiverId, userId),
            eq(messages.isRead, false)
          )
        );

      conversations.push({
        otherUser,
        lastMessage,
        unreadCount: unreadResult?.count || 0,
      });
    }

    return conversations.sort((a, b) => 
      new Date(b.lastMessage.createdAt!).getTime() - new Date(a.lastMessage.createdAt!).getTime()
    );
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  // Job operations
  async createJob(job: InsertJob, posterId: string): Promise<Job> {
    const [newJob] = await db
      .insert(jobs)
      .values({ ...job, posterId })
      .returning();
    return newJob;
  }

  async getJobs(limit = 20): Promise<JobWithPoster[]> {
    const jobsList = await db
      .select({
        job: jobs,
        poster: users,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.posterId, users.id))
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);

    return jobsList
      .filter(({ poster }) => poster)
      .map(({ job, poster }) => ({ ...job, poster: poster! }));
  }

  async getJobById(id: string): Promise<JobWithPoster | undefined> {
    const [jobData] = await db
      .select({
        job: jobs,
        poster: users,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.posterId, users.id))
      .where(eq(jobs.id, id));

    if (!jobData?.poster) return undefined;

    const { job, poster } = jobData;
    return { ...job, poster };
  }

  async applyToJob(application: InsertJobApplication, applicantId: string): Promise<JobApplication> {
    const [newApplication] = await db
      .insert(jobApplications)
      .values({ ...application, applicantId })
      .returning();
    
    await db
      .update(jobs)
      .set({ applicationCount: sql`${jobs.applicationCount} + 1` })
      .where(eq(jobs.id, application.jobId));
    
    return newApplication;
  }

  async getUserJobApplications(userId: string): Promise<(JobApplication & { job: JobWithPoster })[]> {
    const applications = await db
      .select({
        application: jobApplications,
        job: jobs,
        poster: users,
      })
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .leftJoin(users, eq(jobs.posterId, users.id))
      .where(eq(jobApplications.applicantId, userId))
      .orderBy(desc(jobApplications.createdAt));

    return applications
      .filter(({ job, poster }) => job && poster)
      .map(({ application, job, poster }) => ({
        ...application,
        job: { ...job!, poster: poster! },
      }));
  }

  async getJobApplications(jobId: string): Promise<(JobApplication & { applicant: User })[]> {
    const applications = await db
      .select({
        application: jobApplications,
        applicant: users,
      })
      .from(jobApplications)
      .leftJoin(users, eq(jobApplications.applicantId, users.id))
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));

    return applications
      .filter(({ applicant }) => applicant)
      .map(({ application, applicant }) => ({
        ...application,
        applicant: applicant!,
      }));
  }
}

export const storage = new DatabaseStorage();
