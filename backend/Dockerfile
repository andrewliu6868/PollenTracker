# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt /app/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire Django project to the container
COPY . /app/

# Expose the default port that Django uses
EXPOSE 8000

# Run Django's development server on container startup
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
