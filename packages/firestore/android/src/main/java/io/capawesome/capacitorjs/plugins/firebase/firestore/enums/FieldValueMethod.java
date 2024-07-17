package io.capawesome.capacitorjs.plugins.firebase.firestore.enums;

public enum FieldValueMethod {
    CREATE_SERVER_TIMESTAMP("serverTimestamp");

    private String value;

    private FieldValueMethod(String value) {
        this.value = value;
    }

    private String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return this.getValue();
    }

    public static FieldValueMethod fromString(String value) {
        for(FieldValueMethod v : values())
            if(v.getValue().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }
}
