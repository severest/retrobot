json.temperatureChecks do
  json.array! @temperature_checks, partial: 'retro/temperature_check', as: :temperature_check
end
