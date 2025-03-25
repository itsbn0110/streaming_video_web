package dev.streaming.upload.services;

import java.io.IOException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import dev.streaming.upload.DTO.request.PersonRequest;
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.Entity.Person;
import dev.streaming.upload.mapper.PersonMapper;
import dev.streaming.upload.repository.PersonRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PersonService {

    PersonRepository personRepository;
    PersonMapper personMapper;
    public PersonResponse create( PersonRequest request, MultipartFile personAvatar ) throws IOException {
        Person person= personRepository.save(Person.builder().name(request.getPersonName()).roles(request.getPersonRole()).avatar(personAvatar.getBytes()).build());

        PersonResponse personResponse = personMapper.toPersonResponse(person);
        return personResponse;
    }

      public List<Person> getAll() {
        List<Person> countries = personRepository.findAll();
        return countries;
    }

    public void delete(Long personId) {
        personRepository.deleteById(personId);
    }


}
