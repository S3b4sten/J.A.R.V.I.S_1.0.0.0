import time
import psutil
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Permet à l'interface React (port 5173) de parler à Python (port 5000)
CORS(app)

@app.route('/api/stats')
def get_stats():
    # Récupération des vraies stats du PC
    cpu_usage = psutil.cpu_percent(interval=1.0)
    memory_info = psutil.virtual_memory()
    
    # Tentative de récupération de la température (dépend du matériel)
    temp = 40.0
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            # Prend la première température trouvée
            first_key = list(temps.keys())[0]
            temp = temps[first_key][0].current
    except:
        pass # Si non supporté, on garde 40.0 par défaut

    # Simulation d'activité réseau basée sur les paquets envoyés/reçus
    net = psutil.net_io_counters()
    network_activity = (net.bytes_sent + net.bytes_recv) % 100 

    return jsonify({
        "cpu": cpu_usage,
        "memory": memory_info.percent,
        "temp": temp,
        "network": min(network_activity, 100),
        "logic": 98 # Valeur stable pour l'IA
    })

if __name__ == '__main__':
    print("🟢 Système J.A.R.V.I.S connecté. En attente de l'interface...")
    app.run(host='0.0.0.0', port=5000)