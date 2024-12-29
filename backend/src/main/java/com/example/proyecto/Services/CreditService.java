package com.example.proyecto.Services;

import com.example.proyecto.Repositories.CreditRepository;
import com.example.proyecto.Entities.CreditEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
public class CreditService {
    @Autowired
    CreditRepository creditRepository;

    public ArrayList<CreditEntity> getCredits() {
        return (ArrayList<CreditEntity>) creditRepository.findAll();
    }

    public CreditEntity saveCredit(CreditEntity credit) {
        if (credit == null) {
            throw new IllegalArgumentException("Credit entity cannot be null");
        }
        return creditRepository.save(credit);
    }

    public ArrayList<CreditEntity> getClientCredits(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }
        return creditRepository.findByClientID(id);
    }

    public double creditSimulate(CreditEntity credit) {
        if (credit == null || credit.getInterestRate() <= 0 || credit.getYearsLimit() <= 0 || credit.getRequestedAmount() <= 0) {
            throw new IllegalArgumentException("Invalid credit data for simulation");
        }
        double interest = credit.getInterestRate() / 12 / 100;
        int months = credit.getYearsLimit() * 12;
        float amount = credit.getRequestedAmount();
        return (amount * interest * Math.pow((1 + interest), months)) / (Math.pow(1 + interest, months) - 1);
    }

    public CreditEntity findCreditByID(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return creditRepository.findById(id).orElse(null);
    }

    public void deleteCreditById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        creditRepository.deleteById(id);
    }

    public void updateCreditStatus(Long id, CreditEntity.Status status) {
        if (id == null || status == null) {
            throw new IllegalArgumentException("ID or status cannot be null");
        }
        creditRepository.updateCreditStatus(id, status);
    }

    @Transactional
    public void updateObservations(Long id, String observations) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        creditRepository.updateObservations(id, observations);
    }
}