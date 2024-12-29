FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} presta-banco-backend.jar
EXPOSE 8090

ENTRYPOINT ["java", "-jar", "./presta-banco-backend.jar"]