# Rake task for setting Heroku config variables from http://trevorturk.com/2009/06/25/config-vars-and-heroku/
require 'yaml'

namespace :heroku do      
  
  task :config do
  
    puts "Reading config/config.yml and sending config vars to Heroku..."
    
    CONFIG = YAML.load_file("#{File.dirname(__FILE__)}/../../config.yml") rescue {}
    
    if CONFIG != {}
      command = "heroku config:add"
      CONFIG.each {|key, val| command << " #{key}=#{val} " if val }
      system command
    end
  
  end

end