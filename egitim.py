import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

# Verileri yükle
df = pd.read_csv('veriler2.csv', encoding='utf-8-sig')

# Veri setini ayır
X_train, X_test, y_train, y_test = train_test_split(
    df["Metin"], df["Kategori"], test_size=0.3, random_state=42)

# Etiketleri sayısallaştır
label_encoder = LabelEncoder()
y_train_encoded = label_encoder.fit_transform(y_train)
y_test_encoded = label_encoder.transform(y_test)

# One-hot encoding
y_train_categorical = tf.keras.utils.to_categorical(y_train_encoded)
y_test_categorical = tf.keras.utils.to_categorical(y_test_encoded)

# TF-IDF vektörleştirme
vectorizer = TfidfVectorizer(max_features=5000)
X_train_tfidf = vectorizer.fit_transform(X_train).toarray()
X_test_tfidf = vectorizer.transform(X_test).toarray()

# TensorFlow ile YSA modeli
model = tf.keras.Sequential([ 
    tf.keras.layers.Dense(128, activation='relu', input_shape=(X_train_tfidf.shape[1],)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),  
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(y_train_categorical.shape[1], activation='softmax')
])

# Derleme
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Eğitme
model.fit(X_train_tfidf, y_train_categorical,
          epochs=50,
          batch_size=32,
          validation_split=0.2,
          verbose=1)

# Modeli ve dönüştürücüleri kaydet
model.save('model4_tf.h5')  # TF formatı
joblib.dump(vectorizer, 'vectorizer.joblib')
joblib.dump(label_encoder, 'label_encoder.joblib')

print("TensorFlow YSA modeli başarıyla eğitildi ve kaydedildi.")