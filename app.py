from flask import Flask, jsonify
from dotenv import load_dotenv
from numpy import number
load_dotenv()
from recommendation_models import get_movie_recommendation

app = Flask(__name__)

@app.route('/recommendation/<int:fid>')
def api(fid=number):
    # print(fid)
    target = get_movie_recommendation(fid)
    print("Step 3: ",jsonify(target))
    return jsonify(target)

