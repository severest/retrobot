require 'test_helper'

class TeamTest < ActiveSupport::TestCase
  test "create team with no password" do
    assert_difference 'Team.count', 1 do
      Team.create(name: "test")
    end
  end

  test "cant create team with no name" do
    assert_no_difference 'Team.count' do
      Team.create
    end
  end

  test "create team with password" do
    assert_difference 'Team.count', 1 do
      Team.create(name: "test", password: 'password')
    end
  end

  test "create team with stripped and downcase name" do
    t = Team.create(name: "  Some Team NAME??!")
    assert_equal t.name, "some team name??!"
  end

  test "find_or_create team with just name" do
    t = Team.find_or_create(name: "  TEAM ONE")
    assert_equal t.id, teams(:one).id
  end

  test "find_or_create team with new name" do
    assert_difference 'Team.count', 1 do
      t = Team.find_or_create(name: "a brand new team")
    end
  end

  test "find_or_create team with new name and password" do
    assert_difference 'Team.count', 1 do
      t = Team.find_or_create(name: "a brand new team", password: 'hehe')
      assert_equal t.password, 'hehe'
    end
  end

  test "find_or_create password protected team" do
    password_protected_team = teams(:password_protected)
    assert_raises(RetroNotAuthorized) do
      t = Team.find_or_create(name: password_protected_team.name)
    end
    assert_raises(RetroNotAuthorized) do
      t = Team.find_or_create(name: password_protected_team.name, password: nil)
    end
    assert_raises(RetroNotAuthorized) do
      t = Team.find_or_create(name: password_protected_team.name, password: 'jojos')
    end
    t = Team.find_or_create(name: password_protected_team.name, password: 'testpassword')
    assert_not_nil t
  end

  test "find_with_password team with just name" do
    t = Team.find_with_password(name: "  TEAM ONE")
    assert_equal t.id, teams(:one).id
  end

  test "find_with_password team that doesnt exist" do
    assert_raises(TeamNotFound) do
      Team.find_with_password(name: "nonexistant team")
    end
  end

  test "find_with_password team without password" do
    assert_raises(RetroNotAuthorized) do
      password_protected_team = teams(:password_protected)
      Team.find_with_password(name: password_protected_team.name)
    end
  end

  test "find_with_password team with bad password" do
    assert_raises(RetroNotAuthorized) do
      password_protected_team = teams(:password_protected)
      Team.find_with_password(name: password_protected_team.name, password: 'jojo')
    end
  end

  test "find_with_password team with correct password" do
    password_protected_team = teams(:password_protected)
    t = Team.find_with_password(name: password_protected_team.name, password: 'testpassword')
    assert_equal t.id, password_protected_team.id
  end
end
