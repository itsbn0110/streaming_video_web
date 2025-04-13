package dev.streaming.upload.mapper;

<<<<<<< HEAD
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import dev.streaming.upload.DTO.request.PersonRequest;
=======
import org.mapstruct.Mapper;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.Entity.Person;

@Mapper(componentModel = "spring")
public interface PersonMapper {
<<<<<<< HEAD
    Person toPerson (PersonRequest request);
    PersonResponse toPersonResponse (Person person);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(PersonRequest request, @MappingTarget Person person);
=======
    PersonResponse toPersonResponse (Person person);
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
