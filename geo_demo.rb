require 'rubygems'
require 'bundler/setup'
require 'sinatra/base'
require 'json'        
require 'faraday'      

# support yaml and heroku config vars, preferring ENV for heroku
CONFIG = (YAML.load_file("#{File.dirname(__FILE__)}/config.yml") rescue {}).merge(ENV)

class GeoDemo < Sinatra::Application 
  
  set :public, File.dirname(__FILE__) + "/public"
  set :static, true

  get '/' do
    erb :index
  end
  
  post '/places' do
    lat     = params[:lat]    ||  30.26
    lng     = params[:lng]    || -97.73
    radius  = params[:radius] ||  10000
    source  = params[:source] || "encyclopedic/dbpedia/articles"
    # pass a "source" parameter to try any other Infochimps POI endpoints, i.e. "geo/location/infochimps/locationary" 
                                                                          
    url = "http://api.infochimps.com/" + source + "/search?" +
      "_apikey="      + 'flip69'           +
      "&g.latitude="  + lat.to_s           + 
      "&g.longitude=" + lng.to_s           +
      "&g.radius="    + radius.to_s
      "&f.q=*" # not limiting the query to a particular keyword
     
    buffer = Faraday.new(url).get
    result = JSON.parse(buffer.body)   
    p url
    content_type :json 
    result.to_json
  end

end
