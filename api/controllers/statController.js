const statRepository = require("../repositories/statRepository");

async function overview(req, res) {
    try {
        const [summary, details, peakHours] = await Promise.all([
            statRepository.getGlobalStats(),
            statRepository.getClientsPerDay(),
            statRepository.getPeakHours(),
        ]);

        res.json({ summary, details, peakHours });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { overview };
