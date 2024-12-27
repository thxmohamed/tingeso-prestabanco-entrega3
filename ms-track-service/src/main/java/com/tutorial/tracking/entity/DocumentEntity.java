package com.tutorial.tracking.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentEntity {
    private Long id;
    private String filename;
    @Lob
    private byte[] fileData;
    Long creditID;

}
