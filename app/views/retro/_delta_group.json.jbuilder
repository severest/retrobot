json.(delta_group, :id, :notes)
json.deltas do
  json.array! delta_group.deltas, partial: 'retro/delta', as: :delta
end
json.votes do
  json.array! delta_group.delta_group_votes.pluck(:user)
end
