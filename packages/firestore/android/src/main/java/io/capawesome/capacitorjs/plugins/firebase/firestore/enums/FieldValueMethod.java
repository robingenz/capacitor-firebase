package io.capawesome.capacitorjs.plugins.firebase.firestore.enums;

import androidx.annotation.NonNull;

public enum FieldValueMethod {
    ARRAY_REMOVE("arrayRemove"),
    ARRAY_UNION("arrayUnion"),
    DELETE_FIELD("deleteField"),
    INCREMENT("increment"),
    SERVER_TIMESTAMP("serverTimestamp");

    private final String value;

    private FieldValueMethod(String value) {
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

    public static FieldValueMethod fromString(String value) {
        for (FieldValueMethod v : values()) if (v.getValue().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }
}
