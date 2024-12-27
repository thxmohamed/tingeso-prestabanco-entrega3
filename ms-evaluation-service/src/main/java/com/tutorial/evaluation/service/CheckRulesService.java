package com.tutorial.evaluation.service;

import com.tutorial.evaluation.clients.RequestClient;
import com.tutorial.evaluation.clients.UserClient;
import com.tutorial.evaluation.entity.CheckRulesEntity;
import com.tutorial.evaluation.model.CreditModel;
import com.tutorial.evaluation.model.UserModel;
import com.tutorial.evaluation.repository.CheckRulesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class CheckRulesService {
    @Autowired
    CheckRulesRepository checkRulesRepository;
    @Autowired
    RequestClient requestClient;
    @Autowired
    UserClient userClient;

    public CheckRulesEntity createEvaluation(CheckRulesEntity checkRules) {
        if (checkRules.getCreditID() == null || checkRules.getClientID() == null) {
            throw new IllegalArgumentException("CreditID and ClientID cannot be null");
        }
        return checkRulesRepository.save(checkRules);
    }

    public List<CheckRulesEntity> getAll(){
        return checkRulesRepository.findAll();
    }

    public CheckRulesEntity getById(Long id){
        Optional<CheckRulesEntity> check = checkRulesRepository.findById(id);
        return check.orElse(null);
    }
    public CheckRulesEntity getByCreditID(Long id){
        Optional<CheckRulesEntity> check = checkRulesRepository.findByCreditID(id);
        return check.orElse(null);
    }
    @Transactional
    public Boolean checkRelationQuotaIncome(Long checkid) {
        Optional<CheckRulesEntity> checkRulesOpt = checkRulesRepository.findById(checkid);
        if (checkRulesOpt.isPresent()) {
            CheckRulesEntity checkRules = checkRulesOpt.get();
            Optional<CreditModel> creditOpt = Optional.ofNullable(requestClient.getCreditById(checkRules.getCreditID()));
            Optional<UserModel> userOpt = Optional.ofNullable(userClient.getUserById(checkRules.getClientID()));
            if (creditOpt.isPresent() && userOpt.isPresent()) {
                CreditModel credit = creditOpt.get();
                UserModel user = userOpt.get();
                double income = user.getIncome();
                return (credit.getMonthlyFee() / income) * 100 <= 35;
            } else {
                throw new EntityNotFoundException("CreditEntity no encontrado con ID: " + checkRules.getCreditID());
            }
        } else {
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void updateRule1(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRule = checkRulesRepository.findById(checkid);
        if (checkRule.isPresent()) {
            checkRulesRepository.updateRule1(checkid, check);
        }else {
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkCreditHistory(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule2(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkEmploymentStability(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule3(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }
    @Transactional
    public boolean checkDebtIncome(Long checkid, double currentDebt){
        Optional<CheckRulesEntity> checkRulesOpt = checkRulesRepository.findById(checkid);
        if(checkRulesOpt.isPresent()){
            CheckRulesEntity checkRules = checkRulesOpt.get();
            Optional<CreditModel> creditOpt = Optional.ofNullable(requestClient.getCreditById(checkRules.getCreditID()));
            Optional<UserModel> userOpt = Optional.ofNullable(userClient.getUserById(checkRules.getClientID()));
            if(userOpt.isPresent() && creditOpt.isPresent()){
                CreditModel credit = creditOpt.get();
                UserModel user = userOpt.get();
                double totalDebt = credit.getMonthlyFee() + currentDebt;
                return totalDebt/user.getIncome() <= 0.5;
            }else{
                throw new EntityNotFoundException("User o Credit no encontrado");
            }
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void updateRule4(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule4(checkid, check);
        }else {
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public boolean checkApplicantAge(Long checkid){
        Optional<CheckRulesEntity> checkRulesOpt = checkRulesRepository.findById(checkid);
        if(checkRulesOpt.isPresent()){
            CheckRulesEntity checkRules = checkRulesOpt.get();
            Optional<CreditModel> creditOpt = Optional.ofNullable(requestClient.getCreditById(checkRules.getCreditID()));
            Optional<UserModel> userOpt = Optional.ofNullable(userClient.getUserById(checkRules.getClientID()));
            if(creditOpt.isPresent() && userOpt.isPresent()){
                UserModel user = userOpt.get();
                CreditModel credit = creditOpt.get();
                int finalAge = credit.getYearsLimit() + user.getAge();
                return finalAge < 70;
            }
        }else {
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
        return false;
    }

    @Transactional
    public void updateRule6(Long checkid, boolean check) {
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule6(checkid, check);
        }else {
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkMinimumBalance(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule71(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkSavingHistory(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule72(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkPeriodicDeposits(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule73(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkBalanceYearsAgo(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule74(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }

    @Transactional
    public void checkRecentWithdrawals(Long checkid, boolean check){
        Optional<CheckRulesEntity> checkRules = checkRulesRepository.findById(checkid);
        if(checkRules.isPresent()){
            checkRulesRepository.updateRule75(checkid, check);
        }else{
            throw new EntityNotFoundException("CheckRulesEntity no encontrado con ID: " + checkid);
        }
    }
}
