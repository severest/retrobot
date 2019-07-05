class HealthcheckController < ApplicationController
  def amialive
    Delta.first
    render json: { 'msg' => 'I am alive and well' }
  end
end
