package dev.streaming.upload.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import dev.streaming.upload.DTO.request.PersonRequest;
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.Entity.Person;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    Person toPerson(PersonRequest request);

    PersonResponse toPersonResponse(Person person);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(PersonRequest request, @MappingTarget Person person);
}
