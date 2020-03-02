namespace :recurring do
  task :init => :environment do
    RemoveEmptyRetroTask.schedule!
  end
end
