require 'test_helper'

class TeamControllerTest < ActionDispatch::IntegrationTest
  test "get team summary" do
    post '/api/team/summary', params: { team: { name: 'team one' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['retros'].count
  end

  test "get team summary page 2" do
    team = create(:team, name: 'multipage')
    (1..17).each do |n|
      create(:retro, status: 'locked', team: team)
    end
    post '/api/team/summary', params: { page: '2', team: { name: 'multipage' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 7, json_response['retros'].count
  end

  test "get team summary page garbage" do
    team = create(:team, name: 'multipage')
    (1..22).each do |n|
      create(:retro, status: 'locked', team: team)
    end
    post '/api/team/summary', params: { page: 'jojos', team: { name: 'multipage' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 10, json_response['retros'].count
    assert_equal 22, json_response['totalRetros']
  end

  test "get team summary has temperature checks" do
    team = create(:team, name: 'team1')
    retro = create(:retro, status: 'locked', team: team)
    create(:temperature_check, retro: retro, temperature: 4, notes: 'hi', user: '2')
    post '/api/team/summary', params: { team: { name: 'team1' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response['retros'][0]['temperatureChecks'].count
    assert_equal 4, json_response['retros'][0]['temperatureChecks'][0]['temperature']
    assert_equal 'hi', json_response['retros'][0]['temperatureChecks'][0]['notes']
  end

  test "get team temperature check summary" do
    create(:retro_with_temp_check, status: 'locked', created_at: Time.now - 2.months)
    team = create(:team, name: 'team1')
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 2.months)
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 3.months)
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 8.months)
    post '/api/team/temperaturechecks', params: { team: { name: 'team1' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['temperatureChecks'].count
  end

  test "get team temperature doesnt get temp checks from inprogress retros" do
    team = create(:team, name: 'team1')
    create(:retro_with_temp_check, status: 'in_progress', team: team)
    create(:retro_with_temp_check, status: 'voting', team: team)
    create(:retro_with_temp_check, status: 'locked', team: team)
    create(:retro_with_temp_check, status: 'locked', team: team)
    post '/api/team/temperaturechecks', params: { team: { name: 'team1' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['temperatureChecks'].count
  end

  test "get team temperature check summary handles garbage from" do
    create(:retro_with_temp_check, status: 'locked', created_at: Time.now - 2.months)
    team = create(:team, name: 'team1')
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 2.months)
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 3.months)
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 8.months)
    post '/api/team/temperaturechecks', params: { team: { name: 'team1' }, from: 'not a date' }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['temperatureChecks'].count
  end

  test "get team temperature check summary with from date" do
    create(:retro_with_temp_check, status: 'locked', created_at: Time.now - 2.months)
    team = create(:team, name: 'team1')
    retro = create(:retro, status: 'locked', team: team, created_at: Time.now - 2.months)
    temp_check = create(:temperature_check, retro: retro, temperature: 2, notes: 'wow', user: '60')
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 4.months)
    create(:retro_with_temp_check, status: 'locked', team: team, created_at: Time.now - 8.months)
    post '/api/team/temperaturechecks', params: { team: { name: 'team1' }, from: (Date.today - 3.months).strftime('%Y-%m-%d') }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response['temperatureChecks'].count
    assert_equal temp_check.id, json_response['temperatureChecks'][0]['id']
    assert_equal temp_check.temperature, json_response['temperatureChecks'][0]['temperature']
    assert_equal temp_check.notes, json_response['temperatureChecks'][0]['notes']
    assert_equal temp_check.user, json_response['temperatureChecks'][0]['userId']
  end

  test "summary should not show in progess or voting retros" do
    post '/api/team/summary', params: { team: { name: 'permissions' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 0, json_response['retros'].count
  end

  test "team summary denied with no password" do
    post '/api/team/summary', params: { team: { name: 'test team' } }
    assert_response :unauthorized
  end

  test "team summary nonexistant" do
    post '/api/team/summary', params: { team: { name: 'nonexistant' } }
    assert_response :not_found
  end

  test "team summary with password" do
    post '/api/team/summary', params: { team: { name: 'test team', password: 'testpassword' } }
    assert_response :success
  end

  test "team temperaturechecks denied with no password" do
    post '/api/team/temperaturechecks', params: { team: { name: 'test team' } }
    assert_response :unauthorized
  end

  test "team temperaturechecks nonexistant" do
    post '/api/team/temperaturechecks', params: { team: { name: 'nonexistant' } }
    assert_response :not_found
  end

  test "team temperaturechecks with password" do
    post '/api/team/temperaturechecks', params: { team: { name: 'test team', password: 'testpassword' } }
    assert_response :success
  end
end
