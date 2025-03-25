package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.Entity.Person;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    PersonResponse toPersonResponse (Person person);
}
