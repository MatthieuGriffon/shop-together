Shop Together is a collaborative shopping list management web application built using Next.js, Sequelize, and PostgreSQL. Users can create shared shopping lists, manage group memberships, and collaborate in real-time. It also includes user authentication via Google and Facebook using NextAuth.js.

Features
User authentication with OAuth providers (Google, Facebook)
Collaborative shopping lists management
Real-time group management
PostgreSQL as the primary database
Redux for state management
Responsive UI built with TailwindCSS
Getting Started
Prerequisites
Make sure you have the following installed:

Node.js
PostgreSQL
Git
Installation
Clone the repository:

git clone https://github.com/MatthieuGriffon/shop-together.git
Navigate into the project directory:

cd shop-together
Install the dependencies:

npm install
Set up environment variables:

Create a .env.local file in the root directory and add the following:

DATABASE_URL=postgres://<your_db_user>:<your_db_password>@localhost:5432/shop_together_db
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
FACEBOOK_CLIENT_ID=<your_facebook_client_id>
FACEBOOK_CLIENT_SECRET=<your_facebook_client_secret>
NEXTAUTH_SECRET=<your_nextauth_secret>

Initialize the database:

Run the Sequelize sync script to create the tables in your PostgreSQL database:


npx tsx scripts/sync.ts
Running the Development Server
Start the development server:

npm run dev
Visit http://localhost:3000 to use the application.

Features in Development
Add notification features for group updates and item changes
Implement real-time chat within groups
Deploy on a production server
Project Structure
src/app/api/: API routes
src/app/models/: Sequelize models for database entities (Users, Groups, etc.)
src/app/components/: UI components for different features
src/store/: Redux store and slices
Technologies Used
Next.js
Sequelize for ORM
PostgreSQL as the database
Redux for state management
NextAuth.js for authentication
TailwindCSS for styling
Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License.