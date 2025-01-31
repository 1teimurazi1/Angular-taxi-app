package com.example.et_cetera_server.entities;

import com.example.et_cetera_server.dto.RideInfo;
import com.example.et_cetera_server.dto.UserInfo;
import jakarta.persistence.*;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
    private static final String pepper = "{94ed2b62-463d-4d60-b362-837ff8231435}";

    public enum CarModel {
        SEDAN("Sedan", 0),
        SUV("SUV", 1),
        HATCHBACK("Hatchback", 2),
        COUPE("Coupe", 3),
        CONVERTIBLE("Convertible", 4),
        TRUCK("Truck", 5);

        private final Integer id;
        private final String displayName;
        CarModel(String displayName, Integer id) {
            this.displayName = displayName;
            this.id = id;
        }

        public String getDisplayName() {
            return displayName;
        }
        public Integer getId() {
            return id;
        }

        public static CarModel getCarModelById(Integer id) {
            for (CarModel carModel : CarModel.values()) {
                if (carModel.getId().equals(id)) {
                    return carModel;
                }
            }
            return null;
        }
        public static CarModel getCarModelByDisplayName(String displayName) {
            for (CarModel carModel : CarModel.values()) {
                if (carModel.getDisplayName().equals(displayName)) {
                    return carModel;
                }
            }
            return null;
        }
        public static ArrayList<String> getEnumNames() {
            ArrayList<String> enumNames = new ArrayList<>();
            for (CarModel carModel : CarModel.values()) {
                enumNames.add(carModel.getDisplayName());
            }
            return enumNames;
        }
    }

    @Id
    @Column(name = "user_id")
    private UUID id;
    @Column(name = "userType")
    private String userType;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;
    @Column(name = "email")
    private String email;
    @Column(name = "phoneNumber")
    private String phoneNumber;
    @Column(name = "carModel")
    private CarModel carModel;
    @Column(name = "plateNumber")
    private String plateNumber;
    @Column(name = "status")
    private String status;
    @Column(name = "password")
    private String password;
    @Column(name = "salt")
    private UUID salt;
    @Column(name = "currOrderID")
    private Long currOrderID;

    public User() {}
    public User(UserInfo userInfo) {
        this.id = userInfo.getId();
        this.userType = userInfo.getType();
        this.firstName = userInfo.getFirstName();
        this.lastName = userInfo.getLastName();
        this.email = userInfo.getEmail();
        this.phoneNumber = userInfo.getPhoneNumber();
        this.salt = UUID.randomUUID();
        this.password = hashPassword(userInfo.getPassword());

        if (userInfo.getType().equals("driver")) {
            this.plateNumber = userInfo.getPlateNumber();
            this.carModel = CarModel.getCarModelByDisplayName(userInfo.getCarModel());
        }
    }

    private String hashPassword(String password) {
        try {
            int iterations = 65536;
            int keyLength = 255;

            char[] chars = (pepper + password).toCharArray();
            byte[] saltBytes = this.getSalt().toString().getBytes();

            PBEKeySpec spec = new PBEKeySpec(chars, saltBytes, iterations, keyLength);
            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hashBytes = keyFactory.generateSecret(spec).getEncoded();

            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("PBKDF2 algorithm not available: " + e.getMessage(), e);
        } catch (InvalidKeySpecException e){
            throw new RuntimeException("Invalid KeySpec for password hashing: " + e.getMessage(), e);
        }
    }
    public boolean checkPassword(String password) {
        String hashedPassword = this.hashPassword(password);
        return hashedPassword.equals(this.password);
    }

    private UUID getSalt() {
        return salt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setCarModel(CarModel carModel) {
        this.carModel = carModel;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public CarModel getCarModel() {
        return carModel;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public String getStatus() {
        return status;
    }

    public String getUserType() {
        return userType;
    }

    public Long getCurrOrderID() {
        return currOrderID;
    }

    public void setCurrOrderID(Long currOrderID) {
        this.currOrderID = currOrderID;
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{").append("\n");
        sb.append("\t").append("First Name: ").append(getFirstName()).append("\n");
        sb.append("\t").append("Last Name: ").append(getLastName()).append("\n");
        sb.append("\t").append("Email: ").append(getEmail()).append("\n");
        sb.append("\t").append("Phone Number: ").append(getPhoneNumber()).append("\n");
        sb.append("\t").append("Car Model: ").append(getCarModel()).append("\n");
        sb.append("\t").append("PlateNumber: ").append(getPlateNumber()).append("\n");
        sb.append("\t").append("Status: ").append(getStatus()).append("\n");
        sb.append("}");
        return sb.toString();
    }
}
