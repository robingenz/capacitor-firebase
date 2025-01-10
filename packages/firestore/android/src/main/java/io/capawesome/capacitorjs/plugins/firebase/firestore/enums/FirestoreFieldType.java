package io.capawesome.capacitorjs.plugins.firebase.firestore.enums;

import androidx.annotation.NonNull;

public enum FirestoreFieldType {
    FIELD_VALUE("fieldvalue"),
    TIMESTAMP("timestamp");

    private final String value;

    private FirestoreFieldType(String value) {
        this.value = value;
    }

    private String getValue() {
        return value;
    }

    @NonNull
    @Override
    public String toString() {
        return this.getValue();
    }

    public static FirestoreFieldType fromString(String value) {
        for (FirestoreFieldType v : values()) if (v.getValue().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }
}
