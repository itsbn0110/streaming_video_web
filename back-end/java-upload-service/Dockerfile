#stage 1: build

FROM maven:3.9.9-amazoncorretto-21 AS build

#copy source code and pom.xml file /app folder 
WORKDIR /app 
COPY pom.xml .
COPY src ./src

# build source code with maven
RUN mvn package -DskipTests

#stage 2: create image 
# start with amazoncorretto JDK 21
FROM amazoncorretto:21.0.5

# Set working directory to /app and copy compiled file from above step
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Command to run the application 
ENTRYPOINT ["java","-jar", "-Dspring.profiles.active=prod", "app.jar"]