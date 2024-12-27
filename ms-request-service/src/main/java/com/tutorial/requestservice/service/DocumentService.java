package com.tutorial.requestservice.service;

import com.tutorial.requestservice.entity.DocumentEntity;
import com.tutorial.requestservice.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@Transactional
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public List<DocumentEntity> getCreditDocuments(Long id){
        return documentRepository.findByCreditID(id);
    }

    public List<DocumentEntity> getAll(){
        return documentRepository.findAll();
    }
    public DocumentEntity saveFile(DocumentEntity documentEntity){
        return documentRepository.save(documentEntity);
    }

    public void deleteByCreditID(Long id){
        documentRepository.deleteAllByCreditID(id);
    }

    public DocumentEntity getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Document not found with id: " + id));
    }

    public boolean creditHasDocuments(Long id){
        List<DocumentEntity> documents = documentRepository.findByCreditID(id);
        return !documents.isEmpty();
    }
}