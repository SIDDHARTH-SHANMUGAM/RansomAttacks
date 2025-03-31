import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.catalyst.advanced.CatalystAdvancedIOHandler;

public class GetAttacks implements CatalystAdvancedIOHandler {
    private static final Logger LOGGER = Logger.getLogger(GetAttacks.class.getName());

    private static class Attack {
        int attackId;
        String attackerName;
        String victimName;
        long postedDate;
        long deadLine;
        boolean status;

        Attack(int attackId, String attackerName, String victimName, 
              long postedDate, long deadLine, boolean status) {
            this.attackId = attackId;
            this.attackerName = attackerName;
            this.victimName = victimName;
            this.postedDate = postedDate;
            this.deadLine = deadLine;
            this.status = status;
        }
    }

    @Override
    public void runner(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
			System.out.println("Here");
            response.setContentType("application/json");
            
            List<Attack> attacks = new ArrayList<>();
            long currentTime = System.currentTimeMillis();
            
            attacks.add(new Attack(1, "LockBit", "ACME Corp", 
                currentTime - 86400000, currentTime + 604800000, false));
            attacks.add(new Attack(2, "REvil", "GlobalTech", 
                currentTime - 172800000, currentTime + 432000000, true));
            attacks.add(new Attack(3, "DarkSide", "OilCo", 
                currentTime - 43200000, currentTime + 518400000, false));

            StringBuilder jsonResponse = new StringBuilder();
            jsonResponse.append("{\"status\":\"success\",\"data\":{\"attacks\":[");
            
            for (int i = 0; i < attacks.size(); i++) {
                Attack attack = attacks.get(i);
                jsonResponse.append(String.format(
                    "{\"attackId\":%d,\"attackerName\":\"%s\",\"victimName\":\"%s\"," +
                    "\"postedDate\":%d,\"deadLine\":%d,\"status\":%b}",
                    attack.attackId, attack.attackerName, attack.victimName,
                    attack.postedDate, attack.deadLine, attack.status));
                
                if (i < attacks.size() - 1) {
                    jsonResponse.append(",");
                }
            }
            
            jsonResponse.append("],\"hasMore\":false,\"totalCount\":3}}");
            
            response.setStatus(200);
            response.getWriter().write(jsonResponse.toString());
            
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error in GetAttacks", e);
            response.setStatus(500);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Internal server error\"}");
        }
    }
}