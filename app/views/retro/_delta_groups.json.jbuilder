json.delta_groups do
  json.array! retro.delta_groups, partial: 'retro/delta_group', as: :delta_group
end
