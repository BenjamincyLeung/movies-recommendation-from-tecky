# %%
from os import execl
import pandas as pd
from bs4 import BeautifulSoup
import requests
import csv
movie_image_array = []

# %%
# url = 'https://www.imdb.com/title/{imdb_id}'
excel_file = "../movie.xlsx"
df = pd.read_excel(excel_file, usecols=['imdb_id'])

values_df = df.values
def imdb_function():
 for item in values_df:
    url = 'https://www.imdb.com/title/{imdb_id}'.format(imdb_id=item[0])
    page = requests.get(url)
    image_soup = BeautifulSoup(page.content, 'html.parser')
    images = image_soup.find_all("img", class_="ipc-image")
    for i in images[:1]:
        print(i.get('src'))
        movie_image_array.append(i.get('src'))
        print(len(movie_image_array))
        
 with open('Excel_movie_image.csv', 'w')as f:
      print('Hello')
      thewriter = csv.writer(f)
      thewriter.writerow(['imdb_id'])
      for i in range(len(movie_image_array)):
       thewriter.writerow([movie_image_array[i]])
imdb_function()

