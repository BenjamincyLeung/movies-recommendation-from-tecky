
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
import psycopg2

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())


def connect():
    conn = None
    try:
        print('Step 1.1: Connecting to the PostgresSQL database')
        conn = psycopg2.connect(
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host="localhost",
            port=5432,
            database=os.getenv("DB_NAME")
        )
        print('Step 1.2: Connected to the PostgresSQL database')
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        sys.exit(1)
    print("Step 1.3: Connection successful")
    return conn


def postgresql_to_dataframe(conn, select_query, column_names):
    cursor = conn.cursor()
    try:
        cursor.execute(select_query)
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        cursor.close()
        return 1

    tupples = cursor.fetchall()
    cursor.close()

    df = pd.DataFrame(tupples, columns=column_names)
    return df


conn = connect()

# column_name = ["user_id", "rating", "film_name"]
column_name = ["user_id", "rating", "film_id"]

movies = postgresql_to_dataframe(
    conn, "select films.id, film_name, image from films", ["film_id", "title", "image"])
rating_df = postgresql_to_dataframe(
    conn, "select user_id, rating, film_id from ratings", column_name)

rating_df.sort_values(by="film_id", ascending=True)


# movies


final_dataset = rating_df.pivot(
    index="film_id", columns="user_id", values="rating")
final_dataset.sort_values(by="film_id", ascending=True)
final_dataset.fillna(0, inplace=True)
# final_dataset.head()


no_user_voted = rating_df.groupby('film_id')['rating'].agg('count')
no_movie_voted = rating_df.groupby('user_id')['rating'].agg('count')


# f,ax = plt.subplots(1,1,figsize=(16,4))
# # ratings['rating.plot(kind='hist)]
# plt.scatter(no_user_voted.index,no_user_voted,color='mediumseagreen')
# plt.axhline(y=5,color='r')
# plt.xlabel('film_id')
# plt.ylabel('No. of users voted')
# plt.show()


final_dataset = final_dataset.loc[no_user_voted[no_user_voted > 5].index, :]


# f,ax = plt.subplots(1,1,figsize=(16,4))
# plt.scatter(no_movie_voted.index, no_movie_voted,color='mediumseagreen')
# plt.axhline(y=50,color='r')
# plt.xlabel('user_id')
# plt.ylabel('No. of votes by user')
# plt.show()


final_dataset = final_dataset.loc[:, no_movie_voted[no_movie_voted > 50].index]


# final_dataset


sample = np.array([[0, 0, 3, 0, 0], [4, 0, 0, 0, 2], [0, 0, 0, 0, 1]])
sparsity = 1.0 - (np.count_nonzero(sample) / float(sample.size))
# print(sparsity)


csr_sample = csr_matrix(sample)
# print(csr_sample)


csr_data = csr_matrix(final_dataset.values)
final_dataset.reset_index(inplace=True)


knn = NearestNeighbors(metric='cosine', algorithm='brute',
                       n_neighbors=20, n_jobs=-1)
knn.fit(csr_data)


def get_movie_recommendation(id):
    n_movies_to_reccomend = 5
    movie_list = movies[movies['film_id'] == id]
    print("Step 2.1 :",movie_list)
    if len(movie_list):
        movie_idx = movie_list.iloc[0]['film_id']
        movie_idx = final_dataset[final_dataset['film_id']
                                  == movie_idx].index[0]
        distances, indices = knn.kneighbors(
            csr_data[movie_idx], n_neighbors=n_movies_to_reccomend+1)
        rec_movie_indices = sorted(list(zip(indices.squeeze().tolist(
        ), distances.squeeze().tolist())), key=lambda x: x[1])[:0:-1]
        recommend_frame = []
        for val in rec_movie_indices:
            movie_idx = final_dataset.iloc[val[0]]['film_id']
            idx = movies[movies['film_id'] == movie_idx].index
            recommend_frame.append(
                {'Title': movies.iloc[idx]['title'].values[0], 'film_id': movies.iloc[idx]['film_id'].values[0], 'image': movies.iloc[idx]['image'].values[0], 'Distance': val[1]})
        df = pd.DataFrame(recommend_frame, index=range(
            1, n_movies_to_reccomend+1))
        print("Step 2.2 :",df.to_dict('records'))
        return df.to_dict('records')
    else:
        return "No movies found. Please check your input"
