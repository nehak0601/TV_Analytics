from flask import Flask, render_template, request
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
import json
import os
import glob
import collections

script_dir = os.path.dirname(__file__)
rel_path = "csv_data"
# rel_path1 = "static\\images"
abs_file_path = os.path.join(script_dir, rel_path)
# abs_file_path1 = os.path.join(script_dir, rel_path1)

app = Flask(__name__)

@app.route("/")
def home():
	week = request.args.get('week', 'week')
	prog = pd.read_csv(abs_file_path + "/top_programs.csv")
	# prog['Programme'] = prog['Programme'].str[:15]+'.'+'.'+'.'

	if week == 'week':
		prog = prog[prog['Week'] == 18]
	else:
		prog=prog[prog['Week']== int(week)] 	


  # Circlepack Chart:
	df = pd.read_csv(abs_file_path + "/top_channels.csv")
	
	if week == 'week':
		df = df[df['Week'] == 18]
	else:
		df = df[df['Week'] == int(week)]

	layers = ['Languages', 'Genere', 'Channel Name']

	data1 = {"name": 'media', 'children': []}
	for lang in df['Languages'].unique():
		tmp_dict = {'name': lang, 'children':[]}
		genre_df = df[df['Languages'] == lang]
		for genre in genre_df['Genere'].unique():
			_genre_tmp_dict = {"name": genre, 'children':[]}
			channel_df = genre_df[genre_df['Genere'] == genre]
			for channel in channel_df['Channel Name'].unique():
				channel_impr = channel_df.groupby(['Channel Name']).sum()
				_channel_tmp_dict = {"name": channel, 'size': "{}".format(channel_impr.loc[channel, 'Impressions'])}
				_genre_tmp_dict['children'].append(_channel_tmp_dict)

			tmp_dict['children'].append(_genre_tmp_dict)
		data1['children'].append(tmp_dict)

	chart_data1=json.dumps(data1, indent=2)
	data2={'chart_data1': chart_data1}
	

	return render_template("home.html", circle_chart=data2, prog_data = prog.to_json(orient='records'),week_list=week_names(), handler=request)

def week_names():

  df = pd.read_csv(abs_file_path + "/top_channels.csv")
  df = pd.DataFrame(df)
  df_week = df["Week"].unique()
  week_list = df_week.tolist()
  K = 1
  week_list = week_list[: len(week_list) - K] 

  return week_list



if __name__ == "__main__":
    app.run(debug=True, port=8080)