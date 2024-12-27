package com.tutorial.evaluation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentModel {
    private Long id;
    private String filename;
    @Lob
    private byte[] fileData;
    Long creditID;

}
