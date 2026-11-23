/**
 * BLACKPINK Midnight Stage — Java syntax / semantic-token preview.
 * Open this file in VS Code with the theme selected to inspect Java highlighting.
 * Uses Java 17 features (records, switch expressions, and text blocks).
 */
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public final class BlackpinkThemePreview {
    private static final String ARTIST = "BLACKPINK";
    private static final double BONUS_MULTIPLIER = 1.25;

    enum Era { SQUARE_UP, BORN_PINK, DEADLINE }

    record Track(String title, Era era, int streams, boolean favorite) { }

    interface StageAct {
        String perform();
    }

    @Deprecated(since = "1.0", forRemoval = false)
    static final class MainStage implements StageAct {
        private final String city;

        MainStage(String city) {
            this.city = city;
        }

        @Override
        public String perform() {
            return ARTIST + " in your area — " + city;
        }
    }

    /** Demonstrates generic types, operators, method calls, and control flow. */
    private static int score(Track track) {
        int baseScore = track.streams() * 2;
        return track.favorite() ? baseScore + 100 : baseScore;
    }

    private static String eraLabel(Era era) {
        return switch (era) {
            case SQUARE_UP -> "Square Up";
            case BORN_PINK -> "Born Pink";
            case DEADLINE -> "Deadline";
        };
    }

    public static void main(String[] args) {
        List<Track> playlist = List.of(
            new Track("DDU-DU DDU-DU", Era.SQUARE_UP, 310, true),
            new Track("Pink Venom", Era.BORN_PINK, 260, true),
            new Track("Jump", Era.DEADLINE, 180, false)
        );

        Map<Era, String> accents = Map.of(
            Era.SQUARE_UP, "#FF69B4",
            Era.BORN_PINK, "#FFC0D8",
            Era.DEADLINE, "#DA7CEF"
        );

        Optional<Track> topTrack = playlist.stream()
            .filter(track -> track.streams() > 200)
            .max(Comparator.comparingInt(BlackpinkThemePreview::score));

        String banner = """
            BLACKPINK — Midnight Stage
            Java syntax highlighting preview
            """;

        System.out.println(banner);
        StageAct stage = new MainStage("Seoul");
        System.out.println(stage.perform());

        for (Track track : playlist) {
            double weightedStreams = track.streams() * BONUS_MULTIPLIER;
            String line = "%s [%s] streams=%.0f accent=%s".formatted(
                track.title(), eraLabel(track.era()), weightedStreams,
                accents.get(track.era())
            );
            System.out.println(line);
        }

        topTrack.ifPresent(track -> System.out.println("Top: " + track.title()));
        // Compare the colors of comments, generics, enums, variables, and literals.
    }
}