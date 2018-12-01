defmodule Utils do

  def readlines(file) do
    File.stream!(file)
      |> Stream.map(&String.trim_trailing/1)
      |> Enum.to_list
  end

  def readlines_as_integers(file) do
    Utils.readlines(file)
      |> Enum.map(&String.to_integer/1)
  end
end
