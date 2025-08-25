# Environment Variables Setup for Messages Feature

To enable the messages functionality, you need to add the following environment variable to your `.env.local` file:

```bash
# Add this to your .env.local file
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION=your_messages_collection_id
```

## Appwrite Database Setup

You need to create a new collection in your Appwrite database with the following attributes:

### Collection Name: `messages`

### Attributes:

1. **userId** (String, Required)

   - Type: String
   - Size: 255
   - Required: Yes
   - Description: References the user who sent the message

2. **name** (String, Required)

   - Type: String
   - Size: 255
   - Required: Yes
   - Description: User's full name

3. **email** (String, Required)

   - Type: String
   - Size: 255
   - Required: Yes
   - Description: User's email address

4. **phone** (String, Required)

   - Type: String
   - Size: 50
   - Required: Yes
   - Description: User's phone number

5. **message** (String, Required)

   - Type: String
   - Size: 10000
   - Required: Yes
   - Description: The message content

6. **status** (String, Required)
   - Type: String
   - Size: 50
   - Required: Yes
   - Default: "pending"
   - Description: Message status (pending, in-progress, completed)

### Indexes:

- Create an index on `userId` for faster queries
- Create an index on `status` for filtering
- Create an index on `$createdAt` for sorting

### Permissions:

- **Create**: Users (authenticated users can create messages)
- **Read**: Admins only
- **Update**: Admins only (for status updates)
- **Delete**: Admins only

## Steps to Setup:

1. Go to your Appwrite Console
2. Navigate to your database
3. Create a new collection named "messages"
4. Add all the attributes listed above
5. Set up the indexes and permissions
6. Copy the collection ID and add it to your `.env.local` file
7. Restart your development server

After completing these steps, users will be able to send messages through the contact form, and admins will be able to view and manage them through the admin panel.
