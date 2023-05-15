# set the base image
FROM python:3.9-slim-buster

# set the working directory
WORKDIR /app

# copy the contents of the current directory to the container
COPY . .

# install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# set the environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

# expose the port
EXPOSE 5000

# start the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]