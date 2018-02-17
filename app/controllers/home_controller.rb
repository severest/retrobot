class HomeController < ApplicationController
  def index
    render :file => File.join(Rails.root, 'public', 'index.html')
  end
end
