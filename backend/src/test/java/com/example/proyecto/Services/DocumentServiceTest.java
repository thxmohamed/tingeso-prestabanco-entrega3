package com.example.proyecto.Services;

import com.example.proyecto.Entities.CreditEntity;
import com.example.proyecto.Entities.DocumentEntity;
import com.example.proyecto.Repositories.DocumentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
public class DocumentServiceTest {
    @Autowired
    DocumentService documentService;
    @Autowired
    DocumentRepository documentRepository;
    CreditEntity credit = new CreditEntity();
    
    @BeforeEach
    void setup(){
        documentRepository.deleteAll();
    }

    @Test
    void whenGetDocumentList_ThenOk(){
        DocumentEntity document1 = new DocumentEntity();
        documentRepository.save(document1);

        DocumentEntity document2 = new DocumentEntity();
        documentRepository.save(document2);

        List<DocumentEntity> documents = documentService.getAll();
        assertThat(documents).hasSize(2);
    }

    @Test
    void whenGetAllCreditDocuments_ThenOk(){
        credit.setId(1L);

        DocumentEntity document1 = new DocumentEntity();
        document1.setCreditID(1L);
        documentRepository.save(document1);

        DocumentEntity document2 = new DocumentEntity();
        document2.setCreditID(1L);
        documentRepository.save(document2);

        List<DocumentEntity> documents = documentService.getCreditDocuments(1L);
        assertThat(documents).hasSize(2);
        assertThat(documents).allMatch(doc -> doc.getCreditID().equals(1L));
    }


    @Test
    void whenSaveDocument_ThenOk(){
        DocumentEntity document = new DocumentEntity();
        document.setFilename("Testing");
        documentService.saveFile(document);
        Long id = document.getId();

        Optional<DocumentEntity> found = documentRepository.findById(id);
        assertThat(found.isPresent()).isTrue();
        assertThat(found.get().getFilename()).isEqualTo("Testing");
    }

    @Test
    void whenDeleteDocument_ThenOk(){
        DocumentEntity document = new DocumentEntity();
        document.setCreditID(1L);
        DocumentEntity document1 = new DocumentEntity();
        document1.setCreditID(1L);
        documentRepository.save(document);
        documentRepository.save(document1);

        documentService.deleteByCreditID(1L);

        List<DocumentEntity> documents = documentService.getCreditDocuments(1L);
        assertThat(documents).hasSize(0);
    }

    @Test
    void whenGetDocumentByID_ThenOk(){
        DocumentEntity document = new DocumentEntity();
        documentRepository.save(document);

        DocumentEntity found = documentService.getDocumentById(1L);
        assertThat(found).isNotNull();
    }

    @Test
    void whenCreditHasDocuments_ThenTrue(){
        DocumentEntity document = new DocumentEntity();
        document.setCreditID(1L);
        documentRepository.save(document);

        boolean check = documentService.creditHasDocuments(1L);
        assertThat(check).isTrue();
    }

    @Test
    void whenGetDocumentById_NotFound_ThenThrowException() {
        Long nonExistentId = 999L;

        assertThatThrownBy(() -> documentService.getDocumentById(nonExistentId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Document not found with id: " + nonExistentId);
    }
    @Test
    void whenCreditHasNoDocuments_ThenFalse() {
        Long creditId = 2L;

        boolean check = documentService.creditHasDocuments(creditId);
        assertThat(check).isFalse();
    }
}
