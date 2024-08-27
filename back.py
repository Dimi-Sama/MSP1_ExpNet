from flask import Flask, jsonify
from flask_cors import CORS  # Importer CORS
import requests
from bs4 import BeautifulSoup
import re


app = Flask(__name__)
CORS(app)  # Activer CORS pour toutes les routes

def scrape_steam_game(app_id):
    url = f"https://store.steampowered.com/app/{app_id}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',  # S'assurer que le français est priorisé
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive',
    }
    cookies = {'birthtime': '786240001', 'mature_content': '1'}

    session = requests.Session()
    response = session.get(url, headers=headers, cookies=cookies)

    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return {}

    soup = BeautifulSoup(response.content, 'html.parser')

    game_data = {}

    # Titre
    title_element = soup.find('div', class_='apphub_AppName') or soup.find('span', class_='breadcrumb_item active') or soup.find('h2', class_='pageheader')
    game_data['title'] = title_element.text.strip() if title_element else "N/A"

    # Description
    desc_element = soup.find('div', class_='game_description_snippet') or soup.find('div', class_='game_area_description')
    game_data['description'] = desc_element.text.strip() if desc_element else "N/A"

    # Avis
    review_summary = soup.find('span', class_='game_review_summary') or soup.find('div', class_='user_reviews_summary_row')
    game_data['review'] = review_summary.text.strip() if review_summary else "N/A"

    # Images de présentation
    screenshots = soup.find_all('a', class_='highlight_screenshot_link')
    game_data['screenshots'] = [img['href'] for img in screenshots] if screenshots else []

    # Video de couverture
    video = soup.find('div', class_='highlight_player_item highlight_movie')
    game_data['video'] = video['data-webm-source'] if video else "N/A"

    # Image de couverture
    header_image = soup.find('img', class_='game_header_image_full') or soup.find('img', class_='package_header')
    game_data['cover_image'] = header_image['src'] if header_image else "N/A"

    # Configuration minimale
    sys_req = soup.find('div', class_='game_area_sys_req_full') or soup.find('div', class_='game_area_sys_req_leftCol')
    game_data['min_requirements'] = sys_req.text.strip() if sys_req else "N/A"

    # Taille du jeu
    sys_req = soup.find('div', class_='game_area_sys_req_full') or soup.find('div', class_='game_area_sys_req_leftCol')
    if sys_req:
        # Recherche de la taille du disque dans le texte des exigences système
        disk_space_match = re.search(r'(\d+\.?\d*\s*(GB|MB)) d\'espace disque disponible', sys_req.text, re.IGNORECASE)
        game_data['game_size'] = disk_space_match.group(1) if disk_space_match else "N/A"
    else:
        game_data['game_size'] = "N/A"

    # Prix
    price_element = soup.find('div', class_='game_purchase_price') or soup.find('div', class_='discount_final_price')
    if price_element:
        price_text = price_element.text.strip()
        # Suppression des espaces et des symboles non numériques, sauf la virgule
        price_text = ''.join([c for c in price_text if c.isdigit() or c == ','])
        game_data['price'] = f"{price_text}€"
    else:
        game_data['price'] = "N/A"

    return game_data

@app.route('/api/game/<app_id>', methods=['GET'])
def get_game_info(app_id):
    game_info = scrape_steam_game(app_id)
    return jsonify(game_info)

if __name__ == '__main__':
    app.run(debug=True, port=5030)  # Assurez-vous d'utiliser le bon port