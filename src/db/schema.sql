-- Crear la tabla Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role VARCHAR(5) NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);

-- Crear la tabla Posts
CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES Users(id) NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);

-- Crear la tabla Likes
CREATE TABLE Likes (
    id SERIAL PRIMARY KEY,
    postId INTEGER REFERENCES Posts(id) NOT NULL,
    userId INTEGER REFERENCES Users(id) NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    CONSTRAINT unique_like UNIQUE (postId, userId)
);

-- Restricciones de longitud y formato en la tabla Users
ALTER TABLE Users
    ALTER COLUMN username TYPE VARCHAR(15),
    ALTER COLUMN password TYPE VARCHAR(255), 
    ALTER COLUMN email TYPE VARCHAR(50),  

-- Añadir restricción CHECK para el formato del email
ADD CONSTRAINT email_format_check CHECK (email ~* '^.+@.+\..+$'), 

    ALTER COLUMN firstName TYPE VARCHAR(100), 
    ALTER COLUMN lastName TYPE VARCHAR(100); 

-- Restricciones de longitud en la tabla Posts
ALTER TABLE Posts
    ALTER COLUMN content TYPE TEXT; 