from flask import Blueprint, request, jsonify
from mysql.connector import pooling

# Define a Blueprint for auth-related routes
auth_blueprint = Blueprint('auth', __name__)

# Database connection pool configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "ohctech"
}
connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

@auth_blueprint.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.json
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({'message': 'Username and password are required.'}), 400

        # Get the user from the database
        connection = connection_pool.get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or not (password == user['password']):
            return jsonify({'message': 'Invalid email or password.'}), 401

        # If successful, return success message (you can also add JWT tokens here)
        return jsonify({'message': 'Sign-in successful!'}), 200

    except Exception as e:
        return jsonify({'message': f"An error occurred: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
