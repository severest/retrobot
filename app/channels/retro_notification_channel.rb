class RetroNotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "retro_notifications_#{params[:room]}_#{params[:userId]}"
  end
end
