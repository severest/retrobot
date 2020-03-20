json.temperature_checks do
  json.array! @temperature_checks do |check|
    json.(check, :id, :temperature, :notes)
    json.userId check.user
  end
end
