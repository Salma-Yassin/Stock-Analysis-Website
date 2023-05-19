# set the base image
FROM python:3.9-slim-buster

# set the working directory
WORKDIR /app

# Install required packages for building Python packages
RUN apt-get update && \
    apt-get install -y build-essential
    
# copy the contents of the current directory to the container
COPY . .

# install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# set env
ENV FLASK_APP=app.py

# expose the port
EXPOSE 5000

# start the Flask application
CMD [ "flask", "run","--host","0.0.0.0","--port","5000"]