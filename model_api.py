from flask import Flask, request, jsonify 
import tensorflow as tf
import numpy as np
import joblib
from flask_cors import CORS
import random

# Model ve bileşenleri yükle
model = tf.keras.models.load_model("model4_tf.h5")
vectorizer = joblib.load("vectorizer.joblib")
label_encoder = joblib.load("label_encoder.joblib")

# Motivasyon mesajları sözlüğü
motivasyon_mesajlari = {
    "motive_edilmesi_gereken": [
        "Unutma, zor günler geçicidir, sen güçlüsün!",
        "Her adım seni başarıya yaklaştırıyor, pes etme!",
        "Kendine inan, yapabileceğinin en iyisini yapıyorsun!",
        "Bugün zor olabilir ama yarın daha güzel olacak.",
        "Kendine bir şans daha ver, her şey yeniden başlayabilir.",
        "Bir nefes al, toparlan ve tekrar dene!",
        "En karanlık geceden sonra güneş doğar.",
        "Küçük adımlar da seni hedefine götürür.",
        "Bugün olmasa da yarın başaracaksın, yeter ki vazgeçme.",
        "Senin içinde düşündüğünden çok daha büyük bir güç var.",
        "Yorulman normal ama bırakman gerekmiyor.",
        "Başarı, vazgeçmeyenlerin ödülüdür.",
        "İyi şeyler zaman alır, sabretmeye değer.",
        "Her düşüş, daha güçlü kalkışlar içindir.",
        "Kendine biraz anlayış göster, bu da geçecek.",
        "Küçük ilerlemeler büyük değişimlerin başlangıcıdır.",
        "Zorluklar seni tanımlamaz, nasıl başa çıktığın tanımlar.",
        "Şu an hissettiklerin geçici, pes etme.",
        "Daha önce başardın, yine yapabilirsin.",
        "Bu duygular seni yenemez, çünkü sen daha güçlüsün."
    ],
    "normal": [
        "Harika gidiyorsun, böyle devam et!",
        "Enerjin yerinde, başarı seninle!",
        "Gücünü ve azmini koruyorsun, tebrikler!",
        "Pozitifliğin ilham verici!",
        "Kendine verdiğin değer, etrafına da ışık saçıyor.",
        "Motivasyonun çevreni de etkiliyor!",
        "Her geçen gün daha da gelişiyorsun.",
        "İyi alışkanlıkların seni ileri taşıyor.",
        "Yaptığın her küçük şey bir başarıdır.",
        "Kendine duyduğun güven her halinden belli!",
        "Günün nasıl geçtiğini sormaya gerek yok, belli ki harika!",
        "İlerlemen göz kamaştırıcı, durma!",
        "Seninle gurur duyuyorum, aynen devam!",
        "Yaydığın pozitif enerji çevrendekilere de yansıyor.",
        "İstikrarın seni zirveye taşıyacak.",
        "Bugün de kendine iyi davrandın, aferin!",
        "Yaptıkların fark ediliyor, devam et!",
        "Senin enerjin, güneş gibi parlıyor.",
        "Zihnin berrak, kalbin güçlü, bu çok güzel!",
        "Hayatla barışık olman, her şeyi daha güzel yapıyor."
    ]
}
def motivasyon_mesaji_ver(kategori):
    if kategori in motivasyon_mesajlari:
        return random.choice(motivasyon_mesajlari[kategori])
    else:
        return "Her zaman daha iyisini yapabilirsin!"

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("message", "")

    try:
        tfidf = vectorizer.transform([text]).toarray()
        prediction = model.predict(tfidf)
        predicted_label = label_encoder.inverse_transform([np.argmax(prediction)])[0]

        # Motivasyon mesajı al
        motivasyon = motivasyon_mesaji_ver(predicted_label)

        return jsonify({
            "kategori": predicted_label,
            "motivasyon_mesaji": motivasyon
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
print("Mevcut motivasyon etiketleri:", list(motivasyon_mesajlari.keys()))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)