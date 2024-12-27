package com.tutorial.requestservice.controller;

import com.tutorial.requestservice.entity.DocumentEntity;
import com.tutorial.requestservice.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/request/file")
public class DocumentController {
    @Autowired
    DocumentService documentService;

    @GetMapping("/{id}")
    public ResponseEntity<List<DocumentEntity>> listCreditDocuments(@PathVariable Long id){
        List<DocumentEntity> documents = documentService.getCreditDocuments(id);
        return ResponseEntity.ok(documents);
    }


    @GetMapping("/")
    public ResponseEntity<List<DocumentEntity>> listDocuments(){
        List<DocumentEntity> documents = documentService.getAll();
        return ResponseEntity.ok(documents);
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("creditID") Long creditID){
        try{
            String filename = file.getOriginalFilename();
            byte[] fileData = file.getBytes();

            DocumentEntity document = new DocumentEntity();
            document.setFilename(filename);
            document.setFileData(fileData);
            document.setCreditID(creditID);

            documentService.saveFile(document);

            return ResponseEntity.ok("File uploaded successfully");

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadByID(@PathVariable Long id){
        DocumentEntity document = documentService.getDocumentById(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(document.getFilename()).build()); // Establece la descarga del archivo

        return new ResponseEntity<>(document.getFileData(), headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteByCreditID(@PathVariable Long id) {
        try {
            documentService.deleteByCreditID(id);
            return ResponseEntity.ok("Documents deleted successfully");
        } catch (Exception e) {
            System.err.println("Error deleting documents: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting documents");
        }
    }

}
