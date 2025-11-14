# Task Management System Software

Task Management System is a software solution that encapsulates the business logic for managing tasks, projects, dependencies, shared and production materials, and providing detailed analytics. It enables creating and tracking tasks, setting statuses and priorities, assigning ownership, and generating reports for progress monitoring and insights.

## [Jira](https://oib1.atlassian.net/jira/software/projects/DP/boards/1)
Used for issue tracking, sprint/board management, and backlog refinement.  
Short link: https://bit.ly/jira_oib

## [Database & Information System Design](https://excalidraw.com/#room=c040ccf101bbb18e3eb2,ZoE0NSlJie6l5Yff-OCHLg)
Diagram and schema design for the database and information system.  
Short link: https://bit.ly/diagrams_oib

## Database Setup
A Docker Compose MySQL instance is available to initialize the database automatically. The startup script will automatically create a `.env` file in the `database` folder if it doesn't exist, prompting you for the MySQL root password, user username, and user password. The default database name is fixed to "users_db" whereas the other other databases are added automatically with the startup scripts.

To get started:

1. Navigate to the `database` folder.
2. Run the appropriate startup script for your system:
   - **Windows**: Double-click `start.bat` or execute `start.ps1` in PowerShell.
   - **Linux**: Execute `start_linux.sh`.
3. This will automatically start Docker and launch the MySQL container, set up the necessary schema, and populate it with data (coming soon), allowing you to quickly set up your development environment.

The automatically generated .env file should contain the following structure (with values provided by you during the prompt):
```
MYSQL_ROOT_PASSWORD=root_password_of_your_choice
MYSQL_DATABASE=users_db
MYSQL_USER=user_username_of_your_choice
MYSQL_PASSWORD=user_password_of_your_choice
```