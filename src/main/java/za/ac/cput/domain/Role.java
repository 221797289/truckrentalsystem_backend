package za.ac.cput.domain;

public enum Role {
    ADMIN("ADMIN"),
    RENTAL_AGENT("Rental Agent"),
    MECHANIC("Mechanic"),
    HELP_DESK("Help Desk");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
