/*
 *************************************************************************
 * The contents of this file are subject to the Openbravo  Public  License
 * Version  1.1  (the  "License"),  being   the  Mozilla   Public  License
 * Version 1.1  with a permitted attribution clause; you may not  use this
 * file except in compliance with the License. You  may  obtain  a copy of
 * the License at http://www.openbravo.com/legal/license.html
 * Software distributed under the License  is  distributed  on  an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific  language  governing  rights  and  limitations
 * under the License.
 * The Original Code is Openbravo ERP.
 * The Initial Developer of the Original Code is Openbravo SLU
 * All portions are Copyright (C) 2008-2014 Openbravo SLU
 * All Rights Reserved.
 * Contributor(s):  ______________________________________.
 ************************************************************************
*/
package org.openbravo.model.common.bank;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.openbravo.base.structure.ActiveEnabled;
import org.openbravo.base.structure.BaseOBObject;
import org.openbravo.base.structure.ClientEnabled;
import org.openbravo.base.structure.OrganizationEnabled;
import org.openbravo.base.structure.Traceable;
import org.openbravo.model.ad.access.User;
import org.openbravo.model.ad.system.Client;
import org.openbravo.model.common.businesspartner.BusinessPartner;
import org.openbravo.model.common.enterprise.Organization;
import org.openbravo.model.common.geography.Country;
import org.openbravo.model.common.geography.Location;
/**
 * Entity class for entity Bank (stored in table C_Bank).
 *
 * NOTE: This class should not be instantiated directly. To instantiate this
 * class the {@link org.openbravo.base.provider.OBProvider} should be used.
 */
public class Bank extends BaseOBObject implements Traceable, ClientEnabled, OrganizationEnabled, ActiveEnabled {
    private static final long serialVersionUID = 1L;
    public static final String TABLE_NAME = "C_Bank";
    public static final String ENTITY_NAME = "Bank";
    public static final String PROPERTY_ID = "id";
    public static final String PROPERTY_CLIENT = "client";
    public static final String PROPERTY_ORGANIZATION = "organization";
    public static final String PROPERTY_ACTIVE = "active";
    public static final String PROPERTY_CREATIONDATE = "creationDate";
    public static final String PROPERTY_CREATEDBY = "createdBy";
    public static final String PROPERTY_UPDATED = "updated";
    public static final String PROPERTY_UPDATEDBY = "updatedBy";
    public static final String PROPERTY_NAME = "name";
    public static final String PROPERTY_ROUTINGNO = "routingNo";
    public static final String PROPERTY_LOCATIONADDRESS = "locationAddress";
    public static final String PROPERTY_SWIFTCODE = "swiftCode";
    public static final String PROPERTY_OWNBANK = "ownBank";
    public static final String PROPERTY_BANKCODE = "bankCode";
    public static final String PROPERTY_BRANCHCODE = "branchCode";
    public static final String PROPERTY_CONTROLDIGIT = "controlDigit";
    public static final String PROPERTY_INENO = "iNENo";
    public static final String PROPERTY_BUSINESSPARTNER = "businessPartner";
    public static final String PROPERTY_COUNTRY = "country";
    public static final String PROPERTY_BANKACCOUNTLIST = "bankAccountList";

    public Bank() {
        setDefaultValue(PROPERTY_ACTIVE, true);
        setDefaultValue(PROPERTY_OWNBANK, true);
        setDefaultValue(PROPERTY_BANKACCOUNTLIST, new ArrayList<Object>());
    }

    @Override
    public String getEntityName() {
        return ENTITY_NAME;
    }

    public String getId() {
        return (String) get(PROPERTY_ID);
    }

    public void setId(String id) {
        set(PROPERTY_ID, id);
    }

    public Client getClient() {
        return (Client) get(PROPERTY_CLIENT);
    }

    public void setClient(Client client) {
        set(PROPERTY_CLIENT, client);
    }

    public Organization getOrganization() {
        return (Organization) get(PROPERTY_ORGANIZATION);
    }

    public void setOrganization(Organization organization) {
        set(PROPERTY_ORGANIZATION, organization);
    }

    public Boolean isActive() {
        return (Boolean) get(PROPERTY_ACTIVE);
    }

    public void setActive(Boolean active) {
        set(PROPERTY_ACTIVE, active);
    }

    public Date getCreationDate() {
        return (Date) get(PROPERTY_CREATIONDATE);
    }

    public void setCreationDate(Date creationDate) {
        set(PROPERTY_CREATIONDATE, creationDate);
    }

    public User getCreatedBy() {
        return (User) get(PROPERTY_CREATEDBY);
    }

    public void setCreatedBy(User createdBy) {
        set(PROPERTY_CREATEDBY, createdBy);
    }

    public Date getUpdated() {
        return (Date) get(PROPERTY_UPDATED);
    }

    public void setUpdated(Date updated) {
        set(PROPERTY_UPDATED, updated);
    }

    public User getUpdatedBy() {
        return (User) get(PROPERTY_UPDATEDBY);
    }

    public void setUpdatedBy(User updatedBy) {
        set(PROPERTY_UPDATEDBY, updatedBy);
    }

    public String getName() {
        return (String) get(PROPERTY_NAME);
    }

    public void setName(String name) {
        set(PROPERTY_NAME, name);
    }

    public String getRoutingNo() {
        return (String) get(PROPERTY_ROUTINGNO);
    }

    public void setRoutingNo(String routingNo) {
        set(PROPERTY_ROUTINGNO, routingNo);
    }

    public Location getLocationAddress() {
        return (Location) get(PROPERTY_LOCATIONADDRESS);
    }

    public void setLocationAddress(Location locationAddress) {
        set(PROPERTY_LOCATIONADDRESS, locationAddress);
    }

    public String getSwiftCode() {
        return (String) get(PROPERTY_SWIFTCODE);
    }

    public void setSwiftCode(String swiftCode) {
        set(PROPERTY_SWIFTCODE, swiftCode);
    }

    public Boolean isOwnBank() {
        return (Boolean) get(PROPERTY_OWNBANK);
    }

    public void setOwnBank(Boolean ownBank) {
        set(PROPERTY_OWNBANK, ownBank);
    }

    public String getBankCode() {
        return (String) get(PROPERTY_BANKCODE);
    }

    public void setBankCode(String bankCode) {
        set(PROPERTY_BANKCODE, bankCode);
    }

    public String getBranchCode() {
        return (String) get(PROPERTY_BRANCHCODE);
    }

    public void setBranchCode(String branchCode) {
        set(PROPERTY_BRANCHCODE, branchCode);
    }

    public String getControlDigit() {
        return (String) get(PROPERTY_CONTROLDIGIT);
    }

    public void setControlDigit(String controlDigit) {
        set(PROPERTY_CONTROLDIGIT, controlDigit);
    }

    public String getINENo() {
        return (String) get(PROPERTY_INENO);
    }

    public void setINENo(String iNENo) {
        set(PROPERTY_INENO, iNENo);
    }

    public BusinessPartner getBusinessPartner() {
        return (BusinessPartner) get(PROPERTY_BUSINESSPARTNER);
    }

    public void setBusinessPartner(BusinessPartner businessPartner) {
        set(PROPERTY_BUSINESSPARTNER, businessPartner);
    }

    public Country getCountry() {
        return (Country) get(PROPERTY_COUNTRY);
    }

    public void setCountry(Country country) {
        set(PROPERTY_COUNTRY, country);
    }

    @SuppressWarnings("unchecked")
    public List<BankAccount> getBankAccountList() {
      return (List<BankAccount>) get(PROPERTY_BANKACCOUNTLIST);
    }

    public void setBankAccountList(List<BankAccount> bankAccountList) {
        set(PROPERTY_BANKACCOUNTLIST, bankAccountList);
    }

}
