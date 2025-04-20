package dev.streaming.upload.services;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.streaming.upload.DTO.request.PersonRequest;
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.Entity.Person;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
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

    CloudinaryService cloudinaryService;
    PersonRepository personRepository;
    PersonMapper personMapper;

    public PersonResponse create(PersonRequest request, MultipartFile personAvatar) throws IOException {
        String avatar = cloudinaryService.uploadImage(personAvatar);

        Person person = personRepository.save(Person.builder()
                .name(request.getName())
                .role(request.getRole())
                .birthDate(request.getBirthDate())
                .avatar(avatar)
                .build());

        PersonResponse personResponse = personMapper.toPersonResponse(person);
        return personResponse;
    }

    public List<Person> getAllDirectors(String role) {
        List<Person> directors = personRepository.findByRole(role);
        return directors;
    }

    public List<Person> getAllActors(String role) {
        List<Person> actors = personRepository.findByRole(role);
        return actors;
    }

    public PersonResponse updatePerson(PersonRequest request, MultipartFile personAvatar, Long personId)
            throws IOException {
        Person existedPerson =
                personRepository.findById(personId).orElseThrow(() -> new AppException(ErrorCode.PERSON_NOT_EXISTED));

        personMapper.updateFromRequest(request, existedPerson);

        if (personAvatar != null && !personAvatar.isEmpty()) {
            String avatarUrl = cloudinaryService.uploadImage(personAvatar);
            existedPerson.setAvatar(avatarUrl);
        }

        Person savedPerson = personRepository.save(existedPerson);
        return personMapper.toPersonResponse(savedPerson);
    }

    public void delete(Long personId) {
        personRepository.deleteById(personId);
    }
}
